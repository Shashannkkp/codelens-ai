package com.codelens.backend.controller;

import com.codelens.backend.service.CodeReviewService;
import com.codelens.backend.service.CodeReviewService.ReviewAnalysis;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final CodeReviewService codeReviewService;

    public ReviewController(
            CodeReviewService codeReviewService
    ) {
        this.codeReviewService = codeReviewService;
    }

    @PostMapping("/review")
    public ReviewAnalysis reviewCode(
            @RequestBody ReviewRequest request
    ) {

        if (request.code() == null ||
                request.code().isBlank()) {

            throw new IllegalArgumentException(
                    "Code is required"
            );
        }

        return codeReviewService.analyze(
                request.code(),
                request.language()
        );
    }

    public record ReviewRequest(
            String code,
            String language
    ) {
    }
}
