# Build Spring Boot application
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN --mount=type=secret,id=build-ca,required=false \
    if [ -f /run/secrets/build-ca ]; then \
      keytool -importcert -noprompt -trustcacerts -alias build-ca \
        -file /run/secrets/build-ca \
        -keystore "$JAVA_HOME/lib/security/cacerts" -storepass changeit; \
    fi \
    && mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Run application
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/demo-0.0.1.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]