package com.ssafy.dayugi.model.entity;

import com.sun.istack.NotNull;
import lombok.Data;
import javax.persistence.*;


@Data
@Entity
public class DiaryFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fid;

    @ManyToOne
    @JoinColumn(name = "did")
    private Diary diary;

    @ManyToOne
    @JoinColumn(name = "uid")
    private User user;

    @NotNull
    private String file_name;
    @NotNull
    private String file_origname;
    @NotNull
    private String file_path;
}
