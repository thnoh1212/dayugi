import pathlib

import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
import gluonnlp as nlp
import numpy as np
import pandas as pd

from module.model.kobert.utils import get_tokenizer
from module.model.kobert.pytorch_kobert import get_pytorch_kobert_model


ctx = "cuda" if torch.cuda.is_available() else "cpu"
device = torch.device(ctx)

bertmodel, vocab = get_pytorch_kobert_model()

tokenizer = get_tokenizer()
tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)

class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len,
                 pad, pair):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = [transform([i[sent_idx]]) for i in dataset]
        self.labels = [np.int32(i[label_idx]) for i in dataset]

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return (len(self.labels))

## Setting parameters
max_len = 64
batch_size = 64
warmup_ratio = 0.1
num_epochs = 5
max_grad_norm = 1
log_interval = 200
learning_rate =  5e-5

class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size = 768,
                 num_classes=7,
                 dr_rate=None,
                 paras=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate
                 
        self.classifier = nn.Linear(hidden_size , num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)
    
    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        
        _, pooler = self.bert(input_ids = token_ids, token_type_ids = segment_ids.long(), attention_mask = attention_mask.float().to(token_ids.device))
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)

mapping = {0: 'angry',
           1: 'disgust',
           2: 'fear',
           3: 'happiness',
           4: 'neutral',
           5: 'sadness',
           6: 'surprise'}

# root_path = str(pathlib.Path(__file__).parent.absolute())
# checkpoint = torch.load(f"{root_path}/checkpoint/kobert_emotion_classification.pth", map_location=device)
# model = BERTClassifier(bertmodel)
# model.load_state_dict(checkpoint)
# model.eval()

# 문장 예측
def extract_emotion(sentence, model):
    # sentence = "군대에 세 번 가는 꿈을 꿨어..."
    label = 7

    unseen_test = pd.DataFrame([[sentence, label]], columns = [['발화문', '상황']])
    unseen_values = unseen_test.values
    test_set = BERTDataset(unseen_values, 0, 1, tok, max_len, True, False)
    test_input = DataLoader(test_set, batch_size=1, num_workers=5)

    for batch_id, (token_ids, valid_length, segment_ids, label) in enumerate(test_input):
        token_ids = token_ids.long().to(device)
        segment_ids = segment_ids.long().to(device)
        valid_length= valid_length
        output = model(token_ids, valid_length, segment_ids)
        return output
        result = {}
        for idx, element in enumerate(output[0]):
            result[mapping[idx]] = element.item()
        return result


if __name__ == '__main__':
    root_path = str(pathlib.Path(__file__).parent.absolute())
    model = torch.load(f'{root_path}/checkpoint/kobert_emotion_classification.pth', map_location=device)
    model.eval()
    while True:
        sentence = input('sentence : ')
        print(extract_emotion(sentence, model))