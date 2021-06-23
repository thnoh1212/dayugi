package com.ssafy.dayugi.repository;

import com.ssafy.dayugi.model.entity.EmotionRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface EmotionRateRepository extends JpaRepository<EmotionRate, Long> {
    @Transactional
    public int deleteEmotionRateByDiary_Did(int did);
}
