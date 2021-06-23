package com.ssafy.dayugi.model.entity;

import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
//@SqlResultSetMapping(
//        name="DiaryEmotionMapping",
//        classes = @ConstructorResult(
//                targetClass = DiaryEmotion.class,
//                columns = {
//                        @ColumnResult(name="did", type = Integer.class),
//                        @ColumnResult(name="uid", type = Integer.class),
//                        @ColumnResult(name="diary_content", type = String.class),
//                        @ColumnResult(name="review_content", type = String.class),
//                        @ColumnResult(name="diary_date", type = Date.class),
//
//                        @ColumnResult(name="happiness", type = String.class),
//                        @ColumnResult(name="angry", type = String.class),
//                        @ColumnResult(name="disgust", type = String.class),
//                        @ColumnResult(name="fear", type = String.class),
//                        @ColumnResult(name="neutral", type = String.class),
//                        @ColumnResult(name="sadness", type = String.class),
//                        @ColumnResult(name="surprise", type = String.class),
//
//                }
//
//        )
//
//)

@Data
public class DiaryEmotion {
   private int did;
   private int uid;
   private String diary_content;
   private String review_content;
   @DateTimeFormat(pattern = "yyyy-MM-dd")
   private Date diary_date;
    private String happiness;
    private String angry;
    private String disgust;
    private String fear;
    private String neutral;
    private String sadness;
    private String surprise;
    public DiaryEmotion(int did, int uid, String diary_content, String review_content, Date diary_date, String happiness, String angry, String disgust, String fear, String neutral, String sadness, String surprise){
       this.did = did;
       this.uid = uid;
       this.diary_content = diary_content;
       this.review_content = review_content;
       this.diary_date = diary_date;
       this.happiness = happiness;
       this.angry = angry;
       this.disgust =disgust;
       this.fear =fear;
       this.neutral = neutral;
       this.sadness = sadness;
       this.surprise = surprise;
    }
}
