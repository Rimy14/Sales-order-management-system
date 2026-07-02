package com.spil.salesorder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaRoutingController {

    @RequestMapping(value = {
        "/",
        "/sales-order",
        "/sales-order/**"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
