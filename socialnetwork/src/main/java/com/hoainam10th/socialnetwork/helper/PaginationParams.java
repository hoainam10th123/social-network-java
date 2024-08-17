package com.hoainam10th.socialnetwork.helper;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
public class PaginationParams {
    private int pageNumber = 1;
    private int pageSize = 20;
}
