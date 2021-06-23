package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.*;
import com.ssafy.dayugi.repository.DiaryFileRepository;
import com.ssafy.dayugi.repository.DiaryRepository;
import com.ssafy.dayugi.repository.EmotionRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DiaryServiceImpl implements DiaryService {

    @Autowired
    private DiaryRepository diaryRepository;
    @Autowired
    private EmotionRateRepository emotionRateRepository;

    @Override
    public int writeDiary(Diary diary) throws Exception {
        //한줄평 전처리는 어떻게 되는거지??
//        Diary diary = new Diary();
//        int uid = (int) map.get("uid");
//        User user = new User();
//        user.setUid(uid);
//        diary.setUser(user);
//        //diary_date 저장
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
//        String str = map.get("diary_date").toString();
//        java.sql.Date date = new java.sql.Date(formatter.parse(str).getTime());
//
//        diary.setDid((int) map.get("did"));
//        diary.setDiary_content(map.get("diary_content").toString());
//        diary.setReview_content(map.get("review_content").toString());
//        diary.setDiary_date(date);
        diaryRepository.save(diary);//다이어리 저장
        return 1;
    }

    @Override
    public boolean updateDiary(Diary diary) throws Exception {
        Optional<Diary> curDiary = diaryRepository.findDiaryByDid(diary.getDid());
        if (curDiary.isPresent()) {
            curDiary.get().setDiary_date(diary.getDiary_date());
            curDiary.get().setDiary_content(diary.getDiary_content());
            diaryRepository.save(curDiary.get());
            return true;
        }
        return false;
    }

    //완료
    @Override
    public Optional<Diary> readDiary(int did) throws Exception {
        Optional<Diary> diary = diaryRepository.findDiaryByDid(did);
        return diary;
    }

    @Override
    public List<Optional<Diary>> AllDiary(int uid) throws Exception {
        List<Optional<Diary>> diaries = diaryRepository.findDiariesByUser_Uid(uid);
        return diaries;
    }

    @Override
    public List<Optional<Diary>> monthDiary(int uid, int year, int month) throws Exception {
        List<Optional<Diary>> diaries = diaryRepository.findByUserAndDate(uid, year, month);
        return diaries;
    }

    @Override
    public List<DiaryEmotionInterface> periodDiary(int uid, String startDate, String endDate) throws Exception {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
        List<DiaryEmotionInterface> diariesEmotion = diaryRepository.findByUserAndPeriod(uid, startDate, endDate);
        return diariesEmotion;
    }

    //완료
    @Override
    public boolean deleteDiary(int did) throws Exception {
        Optional<Diary> diary = diaryRepository.findDiaryByDid(did);

        if (diary.isPresent()) {
            emotionRateRepository.deleteEmotionRateByDiary_Did(did);
            diaryRepository.deleteDiaryByDid(did);
            return true;
        }
        return false;
    }

    //완료
    @Override
    public boolean deleteAllDiary(int uid) throws Exception {
        List<Optional<Diary>> diaries = diaryRepository.findDiariesByUser_Uid(uid);
        if (!diaries.isEmpty()) {
            for (Optional<Diary> diary : diaries) {
                if (diary.isPresent()) {
                    emotionRateRepository.deleteEmotionRateByDiary_Did(diary.get().getDid());
                }
            }
            diaryRepository.deleteDiariesByUser_Uid(uid);
            return true;
        }
        return false;
    }
}
