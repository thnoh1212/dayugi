package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.Diary;
import com.ssafy.dayugi.model.entity.DiaryFile;

import java.util.List;

public interface FileService {
    public int saveFiles(List<DiaryFile> files) throws Exception;
    public DiaryFile getFile(Long fid) throws Exception;//파일 id로 파일 한개만 가져오기
    public List<DiaryFile> getFiles(int did) throws Exception;//해당 다이어리의 관련 파일 전부 가져오기
    public List<DiaryFile> getUserFiles(int uid) throws Exception;//해당 다이어리의 관련 파일 전부 가져오기
    public boolean deleteAllFile(int did) throws Exception;//해당 다이어리 관련 파일 전부 삭제
    public boolean deleteFile(int fid) throws Exception;//해당 파일만 삭제
    public boolean deleteUserFile(int uid) throws Exception;//사용자가 작성한 파일 전체 삭제
    public boolean updateFiles(int did, List<DiaryFile> newFiles) throws Exception;//파일 수정

}
