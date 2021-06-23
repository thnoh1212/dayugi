package com.ssafy.dayugi.model.entity;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public interface DiaryEmotionInterface {
    Integer getDid();
    Integer getUid();
    String getDiary_content();
    String getReview_content();
    Date getDiary_date();

    String getHappiness();
    String getAngry();
    String getDisgust();
    String getFear();
    String getNeutral();
    String getSadness();
    String getSurprise();
}
