package almora.almorafinal.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("🛍️ Almora Fashion - E-Commerce API")
                        .version("1.0.0")
                        .description("Spring Boot E-Commerce API for Users, Products, Cart, and Orders")
                        .contact(new Contact()
                                .name("Pratham Garg")
                                .email("support@almorafashion.com")
                                .url("https://almorafashion.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
