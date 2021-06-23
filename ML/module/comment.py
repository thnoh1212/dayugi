import pathlib
import numpy as np
import torch
from module.model.kogpt2 import DialogKoGPT2
from kogpt2_transformers import get_kogpt2_tokenizer


ctx = "cuda" if torch.cuda.is_available() else "cpu"
device = torch.device(ctx)

# 저장한 Checkpoint 불러오기
root_path = str(pathlib.Path(__file__).parent.absolute())
save_ckpt_path = f"{root_path}/checkpoint/kogpt2-wellness-auto-regressive.pth"
checkpoint = torch.load(save_ckpt_path, map_location=device)

model = DialogKoGPT2()
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

tokenizer = get_kogpt2_tokenizer()


def generate_comment(sentence):
    tokenized_indexs = tokenizer.encode(sentence[:60])

    input_ids = torch.tensor([tokenizer.bos_token_id,] + tokenized_indexs + [tokenizer.eos_token_id]).unsqueeze(0)

    sample_output = model.generate(input_ids=input_ids)

    answer = tokenizer.decode(sample_output[0].tolist()[len(tokenized_indexs)+1:], skip_special_tokens=True)

    return answer


if __name__ == '__main__':
    while True:
        print(generate_comment(input('Talk:')))