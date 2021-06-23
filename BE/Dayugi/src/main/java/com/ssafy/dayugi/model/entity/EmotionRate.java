package com.ssafy.dayugi.model.entity;
import lombok.*;
import javax.persistence.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
public class EmotionRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="erid")
    private int erid;

    @OneToOne
    @JoinColumn(name = "did")
    private Diary diary;

    @NonNull
    private String happiness;

    @NonNull
    private String angry;

    @NonNull
    private String disgust;

    @NonNull
    private String fear;

    @NonNull
    private String neutral;

    @NonNull
    private String sadness;

    @NonNull
    private String surprise;

}