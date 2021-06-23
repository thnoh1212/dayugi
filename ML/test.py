did = 1

analysis = {'angry' : 0,
            'disgust' : 0,
            'fear' : 0,
            'happiness' : 0,
            'neutral' : 0,
            'sadness' : 0,
            'surprise' : 0}


sql = f"""INSERT INTO dayugi.emotion_rate(did,{','.join([emotion for emotion in analysis.keys()])})
    VALUES ({did},{','.join([str(emotion) for emotion in analysis.values()])})"""
print(sql)