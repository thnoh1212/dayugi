from flask import Flask, render_template, request

from module.dbModule import Database

from module.emotion import extract_emotion, BERTClassifier
from module.summary import summarize_script
from module.comment import generate_comment
import torch


# from flask_cors import CORS
# from flask_restplus import Api, Resource, fields


# @recomm.rount('/')

app = Flask(__name__)

# CORS(app)

# api = Api(app, version='1.0', title='Recommendation API')


emotion_model = torch.load('module/checkpoint/kobert_emotion_classification.pth', map_location='cpu')
emotion_model.eval()

# @app.route('/emotion/', methods=['POST'])
def emotion(did, diary):
    # did = request.json.get('did')
    # diary = request.json.get('diary').split('\n')
    diary = diary.split('\n')

    analysis = {}
    mapping = ['angry', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise']

    scores = torch.zeros(1, 7)
    len_script = 0
    for sentence in diary:
        if len(sentence) > 5:
            len_script += 1
            scores += extract_emotion(sentence, emotion_model)
            # for key, value in output.items():
            #     analysis[key] += value
    
    # SoftMax
    # scores = torch.nn.functional.softmax(scores)

    # Sigmoid
    scores = torch.div(scores, len_script)
    scores = torch.sigmoid(scores)
    # s = torch.sum(scores).item()
    # scores = torch.div(scores, s)

    for idx, score in enumerate(scores[0]):
        analysis[mapping[idx]] = score.item()

    db_class = Database()
    sql = f"""SELECT count(did) FROM dayugi.emotion_rate WHERE did={did}"""
    row = db_class.executeAll(sql)
    if row[0]['count(did)']:
        sql = f"""UPDATE dayugi.emotion_rate SET {','.join([emotion + '=' + str(score) for emotion, score in analysis.items()])} WHERE did={did}"""
    else:
        sql = f"""INSERT INTO dayugi.emotion_rate(did,{','.join([emotion for emotion in analysis.keys()])})
        VALUES ({did},{','.join([str(score) for score in analysis.values()])})"""

    db_class.execute(sql)
    db_class.commit()

    return analysis


# @app.route('/comment/', methods=['POST'])
def comment(did, diary):
    # did = request.json.get('did')
    # diary = request.json.get('diary')
    summaries = summarize_script(diary)
    answer = {}
    for summary in summaries:
        answer[summary] = generate_comment(summaries[0])
    
    for a in answer.values():
        result = a.split('.')

    db_class = Database()
    sql = f"""UPDATE dayugi.diary SET review_content = '{result[0] + '.'}' WHERE (did = '{did}')"""
    db_class.execute(sql)
    db_class.commit()
    
    return answer

@app.route('/diary/', methods=['POST'])
def emotion_comment():
    did = request.json.get('did')
    diary = request.json.get('diary')
    emotion(did, diary)
    comment(did, diary)

    return '성공적으로 저장되었습니다.'

@app.route('/emotion/', methods=['GET'])
def be_emotion():
    uid = request.json.get('uid')
    sdate = request.json.get('sdate')
    edate = request.json.get('edate')

    db_class = Database()
    sql = f"""SELECT diary.did, diary.uid, diary.diary_content, 
              diary.review_content, diary.diary_date, emotion_rate.happiness, 
              emotion_rate.angry,emotion_rate.disgust, emotion_rate.fear, 
              emotion_rate.neutral,emotion_rate.sadness, emotion_rate.surprise
              FROM diary left join emotion_rate on diary.did = emotion_rate.did
              where uid = {uid} and diary_date >= '{sdate}' and diary_date <= '{edate}'"""
    row = db_class.executeAll(sql)
    return {'emotions':row}

if __name__=="__main__":
    # app.run(debug=True)
    # host 등을 직접 지정하고 싶다면
    app.run(host="0.0.0.0", port="5000", debug=True)