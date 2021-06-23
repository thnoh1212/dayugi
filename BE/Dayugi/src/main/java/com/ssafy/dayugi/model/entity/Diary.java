package com.ssafy.dayugi.model.entity;

import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="did")
    private int did;
    @NotNull
    private String diary_content;
    @Lob
    private String review_content;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date diary_date;


//    @JoinColumn(name="uid")
//    private User user;
    @ManyToOne
    @JoinColumn(name="uid", referencedColumnName = "uid", nullable = true)
    private User user;

//    private User user;
}
