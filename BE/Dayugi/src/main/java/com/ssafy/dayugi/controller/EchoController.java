package com.ssafy.dayugi.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/echo")
public class EchoController {
    @PostMapping(value = "")
    @ApiOperation(value = "메아리", notes = "메아리")
    private ResponseEntity Echo(@RequestBody String str) {
        Map result = new HashMap();
        ResponseEntity entity = null;
        result.put("message", str);
        entity = new ResponseEntity<>(result, HttpStatus.CREATED);
        return entity;
    }
}
