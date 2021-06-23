# file name : dbModule.py
# pwd : /project_name/app/module/dbModule.py

import pymysql
from module._security import db_password


class Database():
    def __init__(self):
        self.db = pymysql.connect(host='k4a206.p.ssafy.io',
                                #   port='3306',
                                  user='ssafy',
                                  password=db_password(),
                                  db='dayugi',
                                  charset='utf8')
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchone()
        return row

    def executeAll(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchall()
        return row

    def commit(self):
        self.db.commit()