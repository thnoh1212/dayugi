package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.Diary;
import com.ssafy.dayugi.model.entity.User;
import com.ssafy.dayugi.repository.DiaryFileRepository;
import com.ssafy.dayugi.repository.DiaryRepository;
import com.ssafy.dayugi.repository.EmotionRateRepository;
import com.ssafy.dayugi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    DiaryRepository diaryRepository;
    DiaryFileRepository diaryFileRepository;
    EmotionRateRepository emotionRateRepository;
    PasswordEncoder passwordSecurity;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordSecurity,
                           DiaryRepository diaryRepository,  DiaryFileRepository diaryFileRepository,
                            EmotionRateRepository emotionRateRepository) {
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.diaryFileRepository = diaryFileRepository;
        this.emotionRateRepository = emotionRateRepository;
        this.passwordSecurity = passwordSecurity;
    }

    @Override
    public Optional<User> login(Map map) throws Exception {
        String InputEmail = map.get("email").toString();
        String InputPassword = map.get("password").toString();

        Optional<User> standard = userRepository.findUserByEmail(InputEmail);
        if(standard.isPresent()){
            if(passwordSecurity.matches(InputPassword, standard.get().getPassword())){
                standard.get().setPassword("");
                return standard;
            }
        }
        return Optional.empty();
    }

    @Override
    public int join(User user) throws Exception {
        String email = user.getEmail();
        Optional<User> emailCheck = userRepository.findUserByEmail(email);
        if(emailCheck.isPresent()){
            return 0;
        }
        else {
            user.setPassword(passwordSecurity.encode(user.getPassword()));
            userRepository.save(user);
            return 1;
        }
    }

    @Override
    public boolean checkEmail(String email) throws Exception {
        Optional<User> user = userRepository.findUserByEmail(email);
        return user.isPresent();
    }

    @Override
    public Optional<User> userInfo(String email) throws Exception {
        Optional<User> user = userRepository.findUserByEmail(email);
        user.ifPresent(value -> value.setPassword(""));
        return user;
    }

    @Override
    @Transactional
    public boolean deleteUser(int uid) throws Exception {
        Optional<User> user = userRepository.findUserByUid(uid);
        if(user.isPresent()){
            // 다이어리 파일 삭제
            diaryFileRepository.deleteDiaryFilesByUser_Uid(uid);

            // 유저가 작성한 전체 다이어리 조회
            List<Optional<Diary>> Diaries = diaryRepository.findDiariesByUser_Uid(uid);
            if(!Diaries.isEmpty()){
                for (Optional<Diary> diary : Diaries) {
                    if (diary.isPresent()) {
                        emotionRateRepository.deleteEmotionRateByDiary_Did(diary.get().getDid());
                    }
                }
            }
            // 유저가 작성한 전체 다이어리 삭제
            diaryRepository.deleteDiariesByUser_Uid(uid);
            int check = userRepository.deleteUserByUid(uid);
            if(check != 0)
                return true;
        }
        // 입력받은 email에 매칭되는 정보가 없는 경우
        return false;
    }

    @Override
    public boolean changeUserInfo(User user) throws Exception{
        Optional<User> checkPresent = userRepository.findUserByEmail(user.getEmail());
        if(checkPresent.isPresent()){
            if(user.getPassword() != null && !user.getPassword().equals(""))
                checkPresent.get().setPassword(passwordSecurity.encode(user.getPassword()));
            if(user.getNickname() != null && !user.getNickname().equals(""))
                checkPresent.get().setNickname(user.getNickname());
            userRepository.save(checkPresent.get());
            return true;
        }
        return false;
    }

    public Optional<User> getUserEmail(int uid) throws Exception{
        Optional<User> user = userRepository.findUserByUid(uid);
        if(user.isPresent()){
            return user;
        }
        return Optional.empty();

    }

}
