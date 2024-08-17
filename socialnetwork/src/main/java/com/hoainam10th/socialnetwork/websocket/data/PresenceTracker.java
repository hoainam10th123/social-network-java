package com.hoainam10th.socialnetwork.websocket.data;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class PresenceTracker {
    private static final Set<String> onlineUsers = new HashSet<>();

    public boolean UserConnected(String username){
        boolean isOnline = false;
        synchronized (onlineUsers) {
            isOnline = onlineUsers.add(username);
        }
        return isOnline;
    }

    public boolean UserDisconnected(String username){
        boolean isOffline = false;
        synchronized (onlineUsers) {
            isOffline = onlineUsers.remove(username);
        }
        return isOffline;
    }

    public String[] GetOnlineUsers(){
        String[] usersOnline = {};

        synchronized (onlineUsers) {
            usersOnline = onlineUsers.toArray(String[]::new);
        }
        return usersOnline;
    }
}
