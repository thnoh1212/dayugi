package com.ssafy.dayugi.repository;

import com.ssafy.dayugi.model.entity.Diary;
import com.ssafy.dayugi.model.entity.DiaryEmotion;
import com.ssafy.dayugi.model.entity.DiaryEmotionInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    public Optional<Diary> findDiaryByDid(int did);//did에 해당하는 다이어리 찾기
    //    @EntityGraph(value = "User.uid", type = EntityGraph.EntityGraphType.FETCH)
    public List<Optional<Diary>> findDiariesByUser_Uid(int uid);//사용자가 작성한 다이어리 전체 조회
    @Query(value = "select * from diary where uid= :uid and YEAR(diary_date) = :year and MONTH(diary_date) = :month", nativeQuery = true)
    public List<Optional<Diary>> findByUserAndDate(@Param("uid") int uid, @Param("year")  int year, @Param("month")  int month);//uid, year, month 일치하는 다이어리 전체 조회
    @Query(value = "SELECT d.did, d.uid, d.diary_content, \n" +
            "d.review_content, d.diary_date, \n" +
            "e.happiness, e.angry,e.disgust, e.fear, \n" +
            "e.neutral,e.sadness, e.surprise\n" +
            "FROM diary d left join emotion_rate e on d.did = e.did\n" +
            "where uid = :uid and diary_date >= :startDate and diary_date <= :endDate", nativeQuery = true)
    public List<DiaryEmotionInterface> findByUserAndPeriod(@Param("uid") int uid, @Param("startDate")  String startDate, @Param("endDate")  String endDate);//uid, year, month 일치하는 다이어리 전체 조회

    @Transactional
    public int deleteDiaryByDid(int did);//다이어리 한 개 삭제
    @Transactional
    public int deleteDiariesByUser_Uid(int uid);//사용자가 작성한 다이어리 전체 삭제
    @Query(value = "select * from diary where uid= :uid and diary_date = :diary_date", nativeQuery = true)
    public int findDiaryByUidAndDate(@Param("uid") int uid, @Param("diary_date")  Date diary_date);//did 찾기

}
