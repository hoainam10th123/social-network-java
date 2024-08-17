package com.hoainam10th.socialnetwork.helper;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Pagination <T>{
    private int totalPages;
    private long count;
    private int pageNumber;
    private int pageSize;
    private List<T> data;

    public Pagination(int pageNumber, int pageSize, long count, List<T> data){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.count = count;
        this.data = data;
        this.totalPages = (int) Math.ceil((double) count / pageSize);
    }
}
