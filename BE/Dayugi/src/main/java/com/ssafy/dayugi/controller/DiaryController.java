package com.ssafy.dayugi.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafy.dayugi.model.entity.*;
import com.ssafy.dayugi.service.DiaryService;
import com.ssafy.dayugi.service.FileService;
import com.ssafy.dayugi.util.MD5Generator;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/diary")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;
    @Autowired
    private FileService fileService;

    @PostMapping(value = "")
    @ApiOperation(value = "다이어리 작성", notes = "다이어리 작성, 한줄평 저장")
    private ResponseEntity writeDiary(@ModelAttribute Diary diary, @RequestParam(required = false) List<MultipartFile> files) {
        diary.getDiary_date();
        Map result = new HashMap();
        String path = System.getProperty("user.dir");
        System.out.println("Working Directory = " + path);

        ResponseEntity entity = null;
        try {
            if (diaryService.writeDiary(diary) == 1) {
                result.put("success", "success");
                result.put("diary", diary);
            } else {
                result.put("success", "fail to write diary");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

        try {
            List<DiaryFile> diaryFiles = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    String origFilename = file.getOriginalFilename();
                    String filename = new MD5Generator(origFilename).toString();
                    // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
                    String savePath = "/home/image";
                    // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
                    if (!new File(savePath).exists()) {
                        System.out.println("~~no file~~");
                        try {
                            new File(savePath).mkdir();
                        } catch (Exception e) {
                            e.getStackTrace();
                        }
                    }


                    String filePath = savePath + "/" + filename + ".jpg";
                    File newfile = new File(filePath);
                    file.transferTo(newfile);

                    DiaryFile diaryFile = new DiaryFile();
                    diaryFile.setFile_origname(origFilename);
                    diaryFile.setFile_name(filename);
                    diaryFile.setFile_path(filePath);
                    diaryFile.setDiary(diary);
                    diaryFile.setUser(diary.getUser());
                    diaryFiles.add(diaryFile);
                }
            }

            try {
                if (fileService.saveFiles(diaryFiles) == 1) {
                    result.put("success", "success");
                    result.put("diary", diary);
                } else {
                    result.put("success", "fail to save file");
                }
                entity = new ResponseEntity<>(result, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                result.put("success", "error");
                entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

        //flask로 did랑 diary_content 보내기
        Map<String, String> parameters = new HashMap<>();
        parameters.put("did", Integer.toString(diary.getDid()));
        parameters.put("diary", diary.getDiary_content());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<Map<String, String>>(parameters, headers);

        String url = "http://k4a206.p.ssafy.io:5000/diary/";
        ResponseEntity<String> res = new RestTemplate().postForEntity(url, request, String.class);

        return entity;
    }

    @PutMapping(value = "")
    @ApiOperation(value = "다이어리 수정", notes = "다이어리 수정")
    private ResponseEntity updateDiary(@ModelAttribute Diary diary, @RequestParam(required = false) List<MultipartFile> files) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            boolean checkSuccess = diaryService.updateDiary(diary);
            if (checkSuccess) {
                result.put("success", "success");
                result.put("diary", diary);
            } else {
                result.put("success", "fail");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

//        if(flag == 0) {
//
//        }
//        else if(flag == 2){//파일 삭제
//            try {
//                boolean checkDeleteFile = fileService.deleteAllFile(diary.getDid());
//                if (checkDeleteFile) {
//                    result.put("success", "success");
//                } else {
//                    result.put("success", "fail");
//                    result.put("message", "삭제할 파일 없음");
//                }
//                entity = new ResponseEntity<>(result, HttpStatus.OK);
//            } catch (Exception e) {
//                e.printStackTrace();
//                result.put("success", "error");
//                entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
//            }
//        }
       

        //파일 수정
        try {
            List<DiaryFile> diaryFiles = new ArrayList<>();
            if (files != null) {
                for (MultipartFile file : files) {
                    String origFilename = file.getOriginalFilename();
                    String filename = new MD5Generator(origFilename).toString();
                    // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
//                    String savePath = System.getProperty("user.dir") + "\\files";
                    String savePath = "/home/image";

                    // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
                    if (!new File(savePath).exists()) {
                        try {
                            new File(savePath).mkdir();
                        } catch (Exception e) {
                            e.getStackTrace();
                        }
                    }
                    String filePath = savePath + "/" + filename + ".jpg";
                    file.transferTo(new File(filePath));

                    DiaryFile diaryFile = new DiaryFile();
                    diaryFile.setFile_origname(origFilename);
                    diaryFile.setFile_name(filename);
                    diaryFile.setFile_path(filePath);
                    diaryFile.setDiary(diary);
                    diaryFile.setUser(diary.getUser());
                    diaryFiles.add(diaryFile);
                }
            }
            try {
                boolean checkFileSuccess = fileService.updateFiles(diary.getDid(), diaryFiles);
                if (checkFileSuccess) {
                    result.put("success", "success");
                } else {
                    result.put("success", "fail");
                    result.put("message", "파일 업데이트 실패");
                }
                entity = new ResponseEntity<>(result, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                result.put("success", "error");
                entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }


        //flask로 did랑 diary_content 보내기
        Map<String, String> parameters = new HashMap<>();
        parameters.put("did", Integer.toString(diary.getDid()));
        parameters.put("diary", diary.getDiary_content());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<Map<String, String>>(parameters, headers);

        String url = "http://k4a206.p.ssafy.io:5000/diary/";
        ResponseEntity<String> res = new RestTemplate().postForEntity(url, request, String.class);

        return entity;
    }

    @DeleteMapping(value = "")
    @ApiOperation(value = "다이어리 삭제", notes = "did를 받아 선택한 다이어리 삭제")
    private ResponseEntity deleteDiary(@RequestParam int did) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            boolean checkFileSuccess = fileService.deleteAllFile(did);
            if (checkFileSuccess) {
                result.put("success", "success");
            } else {
                result.put("success", "fail");
                result.put("message", "fail to delete files of diary");
            }

            boolean checkSuccess = diaryService.deleteDiary(did);
            if (checkSuccess) {
                result.put("success", "success");
            } else {
                result.put("success", "fail");
                result.put("message", "fail to delete diary");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @DeleteMapping(value = "/all")
    @ApiOperation(value = "다이어리 전체 삭제", notes = "사용자가 작성한 다이어리 전체 삭제")
    private ResponseEntity deleteAllDiary(@RequestParam int uid) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            boolean checkFileSuccess = fileService.deleteUserFile(uid);
            if (checkFileSuccess) {
                result.put("success", "success");
            } else {
                result.put("success", "fail");
                result.put("message", "fail to delete files");
            }
            boolean checkSuccess = diaryService.deleteAllDiary(uid);
            if (checkSuccess) {
                result.put("success", "success");
            } else {
                result.put("success", "fail");
                result.put("message", "fail to delete all diary");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @GetMapping(value = "")
    @ApiOperation(value = "다이어리 상세 조회", notes = "did를 받아 다이어리 1개 상세 조회")
    private ResponseEntity readDiary(@RequestParam int did) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            Optional<Diary> diary = diaryService.readDiary(did);
            if (diary.isPresent()) {
                result.put("success", "success");
                result.put("diary", diary);
                List<DiaryFile> diaryFiles = fileService.getFiles(did);
                if (!diaryFiles.isEmpty()) {
                    result.put("success", "success");
                    result.put("diaryFiles", diaryFiles);
                } else {
                    result.put("success", "fail");
                    result.put("message", "No File Data");
                }
            } else {
                result.put("success", "fail");
                result.put("message", "No Diary Data");
            }


            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @GetMapping(value = "/monthly")
    @ApiOperation(value = "다이어리 월별 조회", notes = "사용자가 특정 연도,달에 작성한 다이어리 모두 조회")
    private ResponseEntity monthDiary(@RequestParam int uid, int year, int month) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            List<Optional<Diary>> diaries = diaryService.monthDiary(uid, year, month);
            if (!diaries.isEmpty()) {
                result.put("success", "success");
                result.put("diaries", diaries);
            } else {
                result.put("success", "fail");
                result.put("message", "No Diary Data");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @GetMapping(value = "/period")
    @ApiOperation(value = "다이어리 기간별 조회", notes = "사용자가 특정 연도,달, 일 기간에 작성한 다이어리 모두 조회")
    private ResponseEntity periodDiary(@RequestParam int uid, String startDate, String endDate) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            List<DiaryEmotionInterface> diaries = diaryService.periodDiary(uid, startDate, endDate);
            if (!diaries.isEmpty()) {
                result.put("success", "success");
                result.put("data", diaries);
            } else {
                result.put("success", "No Diary Data");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @GetMapping(value = "/all")
    @ApiOperation(value = "다이어리 전체 조회", notes = "사용자가 작성한 다이어리 전체 조회")
    private ResponseEntity monthDiary(@RequestParam int uid) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            List<Optional<Diary>> diaries = diaryService.AllDiary(uid);
            if (!diaries.isEmpty()) {
                result.put("success", "success");
                result.put("diaries", diaries);
            } else {
                result.put("success", "No Diary Data");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @GetMapping(value = "/diaryfile")
    @ApiOperation(value = "다이어리 파일 조회", notes = "다이어리 파일 조회")
    private ResponseEntity fileDiary(@RequestParam int uid) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        try {
            List<DiaryFile> files = fileService.getUserFiles(uid);
            if (!files.isEmpty()) {
                result.put("success", "success");
                result.put("diaries", files);
            } else {
                result.put("success", "fail");
            }
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", "error");
            entity = new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
        return entity;
    }


}
