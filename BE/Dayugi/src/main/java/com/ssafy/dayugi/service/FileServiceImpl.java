package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.Diary;
import com.ssafy.dayugi.model.entity.DiaryFile;
import com.ssafy.dayugi.repository.DiaryFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FileServiceImpl implements FileService {
    @Autowired
    private DiaryFileRepository diaryFileRepository;

    @Override
    public int saveFiles(List<DiaryFile> files) {
        diaryFileRepository.saveAll(files);
        return 1;
    }

    @Override
    public DiaryFile getFile(Long fid) {
        DiaryFile file = diaryFileRepository.findById(fid).get();
        return file;
    }

    @Override
    public List<DiaryFile> getFiles(int did) throws Exception {
        List<DiaryFile> diaryFiles = diaryFileRepository.findDiaryFilesByDiary_Did(did);
        return diaryFiles;
    }

    @Override
    public List<DiaryFile> getUserFiles(int uid) throws Exception {
        List<DiaryFile> diaryFiles = diaryFileRepository.findDiaryFilesByUser_Uid(uid);
        return diaryFiles;
    }

    @Override
    public boolean deleteAllFile(int did) throws Exception {
        List<DiaryFile> diaryFiles = diaryFileRepository.findDiaryFilesByDiary_Did(did);
        if(!diaryFiles.isEmpty()){
            diaryFileRepository.deleteDiaryFilesByDiary_Did(did);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteFile(int fid) throws Exception {
        Optional<DiaryFile> diaryFile = diaryFileRepository.findDiaryFileByFid(fid);
        if(diaryFile.isPresent()){
            diaryFileRepository.deleteDiaryFileByFid(fid);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteUserFile(int uid) throws Exception {
        diaryFileRepository.deleteDiaryFilesByUser_Uid(uid);
        return true;
    }

    @Override
    public boolean updateFiles(int did, List<DiaryFile> newFiles) throws Exception {
        DiaryFile diaryFiles = diaryFileRepository.findDiaryFileByDiary_Did(did);
        if(diaryFiles != null) {
            diaryFileRepository.deleteDiaryFileByDiary_Did(did);
            System.out.println(diaryFiles.getFid());
        }
        if(!newFiles.isEmpty()) {
            diaryFileRepository.saveAll(newFiles);
        }
        return true;
    }
}
