package com.ssafy.dayugi.controller;

import com.ssafy.dayugi.util.JwtTokenProvider;
import com.ssafy.dayugi.model.entity.User;
import com.ssafy.dayugi.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
//@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController extends GlobalControllerAdvice{

    @Autowired
    private UserService userService;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    private JwtTokenProvider jwtTokenProvider;

    public UserController(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping(value = "")
    @ApiOperation(value = "로그인", notes = "email, password를 받아 정보 확인 후 유저정보 반환")
    private ResponseEntity login(@RequestBody Map map) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        HttpHeaders httpHeaders = new HttpHeaders();
        Optional<User> user = userService.login(map);
        if (user.isPresent()) {
            result.put("success", "success");
            result.put("data", user);
            String token = jwtTokenProvider.createToken(user.get().getUid());
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                Authentication authentication = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("{} 로그인 정보를 저장했습니다", user.get().getEmail());
                result.put("Authorization",("Bearer " + token));
                entity = new ResponseEntity<>(result,httpHeaders, HttpStatus.OK);
            }
            httpHeaders.add("Authorization", "Bearer " + token);
        } else {
            result.put("success", "fail");
            result.put("message", "ID 또는 비밀번호를 확인하세요.");
            entity = new ResponseEntity<>(result,httpHeaders, HttpStatus.ACCEPTED);
        }
        return entity;
    }

    // 회원가입
    @PostMapping(value = "/join")
    @ApiOperation(value = "회원가입", notes = "유저dto를 받아 이메일 중복확인 후 db에 저장")
    private ResponseEntity join(@RequestBody User user) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        if(userService.join(user) == 1){
            result.put("success", "success");
            entity = new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        else{
            result.put("success", "fail");
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        }
        return entity;
    }

    @GetMapping(value = "/check")
    @ApiOperation(value = "email중복 확인", notes = "email을 받아 이메일 중복 확인")
    private ResponseEntity checkEmail(String email) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        boolean checkDuplicate = userService.checkEmail(email);
        if (!checkDuplicate) {
            result.put("success", "success");
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            result.put("success", "fail");
            entity = new ResponseEntity<>(result, HttpStatus.ACCEPTED);
        }
        return entity;
    }

    @DeleteMapping(value = "")
    @ApiOperation(value = "회원탈퇴", notes = "uid을 입력받아 해당되는 유저정보 삭제")
    private ResponseEntity delete(int uid) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        boolean checkSuccess = userService.deleteUser(uid);
        if (checkSuccess) {
            result.put("success", "success");
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            result.put("success", "fail");
            entity = new ResponseEntity<>(result, HttpStatus.ACCEPTED);
        }
        return entity;
    }

    @GetMapping(value = "")
    @ApiOperation(value = "회원정보 조회", notes = "이메일을 입력받아 해당하는 유저의 정보 반환")
    private ResponseEntity searchInfo(@RequestParam String email) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        Optional<User> user = userService.userInfo(email);
        if(user.isPresent()){
            result.put("success", "success");
            result.put("data", user);
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        }
        else{
            result.put("success", "fail");
            entity = new ResponseEntity<>(result, HttpStatus.ACCEPTED);
        }
        return entity;
    }

    @PutMapping(value = "")
    @ApiOperation(value = "회원정보 수정", notes = "이미 가입한 유저정보를 입력받아 db내용 수정")
    private ResponseEntity modifyUser(@RequestBody User user) throws Exception{
        Map result = new HashMap();
        ResponseEntity entity = null;
        boolean checkSuccess = userService.changeUserInfo(user);
        if(checkSuccess){
            result.put("success", "success");
            entity = new ResponseEntity<>(result, HttpStatus.OK);
        }
        else{
            result.put("success", "fail");
            entity = new ResponseEntity<>(result, HttpStatus.ACCEPTED);
        }

        return entity;
    }

    @PostMapping(value = "/token")
    private ResponseEntity tokenReissue(ServletRequest request, @RequestBody Map map) throws Exception{
        ResponseEntity entity = null;
        HttpHeaders httpHeaders = new HttpHeaders();
        Map result = new HashMap();
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String token2 = jwtTokenProvider.resolveToken((HttpServletRequest) request);
        String[] parts = token2.split("\\.");
        String payloadJson = new String(decoder.decode(parts[1]));
        payloadJson = payloadJson.split(",")[0];
        payloadJson = payloadJson.split(":")[1];
        int tokenUid = Integer.parseInt(payloadJson.replace("\"", ""));
        int uid = (Integer)map.get("uid");
        Optional<User> user = userService.getUserEmail(uid);

        try {
            if(tokenUid == uid && user.isPresent()){
                String email = user.get().getEmail();
                result.put("success", "success");

                String token = jwtTokenProvider.createToken(uid);
                if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                    Authentication newAuthentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(newAuthentication);
                    logger.info("{} 로그인 정보를 저장했습니다", email);
                    result.put("Authorization",("Bearer " + token));
                    entity = new ResponseEntity<>(result,httpHeaders, HttpStatus.OK);
                }
                httpHeaders.add("Authorization", "Bearer " + token);
            }else{
                result.put("success", "fail");
                result.put("message", "토큰과 일치하지 않는 회원 정보");
                entity = new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
            }
        }catch (NullPointerException e){
            result.put("success", "fail");
            result.put("message", "만료된 토큰");
            entity = new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
        }
        return entity;
    }


    //JWT 필터링 테스트
//    @GetMapping(value = "/test")
//    private ResponseEntity test(){
//        ResponseEntity entity = null;
//        Map result = new HashMap();
//
//        result.put("data","TEST API");
//        entity = new ResponseEntity<>(result, HttpStatus.OK);
//        return entity;
//    }
}
