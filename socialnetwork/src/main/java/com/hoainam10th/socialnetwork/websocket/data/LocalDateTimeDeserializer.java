package com.hoainam10th.socialnetwork.websocket.data;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.Instant;

public class LocalDateTimeDeserializer extends JsonDeserializer<Instant> {
    @Override
    public Instant deserialize(JsonParser arg0, DeserializationContext arg1) throws IOException {
        return Instant.parse(arg0.getText());
    }
}
