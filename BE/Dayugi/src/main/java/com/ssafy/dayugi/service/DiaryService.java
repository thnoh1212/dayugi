package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.Diary;
import com.ssafy.dayugi.model.entity.DiaryEmotion;
import com.ssafy.dayugi.model.entity.DiaryEmotionInterface;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DiaryService {
    public int writeDiary(Diary diary)throws Exception;//다이어리 작성
    public boolean updateDiary(Diary diary) throws Exception;//다이어리 수정
    public Optional<Diary> readDiary(int did) throws Exception;//다이어리 상세 조회
    public List<Optional<Diary>> AllDiary(int uid) throws Exception;//사용자가 작성한 다이어리 전체 조회
    public List<Optional<Diary>> monthDiary(int uid, int year, int month) throws Exception;//다이어리 연도, 월별 조회
    public List<DiaryEmotionInterface> periodDiary(int uid, String startDate, String endDate) throws Exception;//다이어리 연도, 월, 일별 조회
    public boolean deleteDiary(int did) throws Exception;//다이어리 한 개 삭제
    public boolean deleteAllDiary(int uid) throws Exception;//작성한 다이어리 전체 삭제
}
