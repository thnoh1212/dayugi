package com.ssafy.dayugi.service;

import com.ssafy.dayugi.model.entity.User;

import java.util.Map;
import java.util.Optional;

public interface UserService {
    public Optional<User> login(Map map) throws Exception;
    public int join(User user) throws Exception;
    public boolean checkEmail(String email) throws Exception;
    public Optional<User> userInfo(String email) throws Exception;
    public boolean deleteUser(int uid) throws Exception;
    public boolean changeUserInfo(User user) throws Exception;
    public Optional<User> getUserEmail(int uid) throws Exception;
}
