package almora.almorafinal.Config;

import almora.almorafinal.Entities.Product;
import almora.almorafinal.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
@Component
@Profile("dev")
@RequiredArgsConstructor
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    private final Random random = new Random();

    private final String[] menSubCategories = {
            "Shirt", "T-Shirt", "Jeans",
            "Pants", "Hoodie", "Jacket", "Shoes"
    };

    private final String[] womenSubCategories = {
            "Dress", "Top", "Jeans",
            "Pants", "Hoodie", "Jacket", "Shoes"
    };

    private final String[] brands = {
            "Nike", "Adidas", "H&M",
            "Levis", "Puma", "Zara", "Roadster"
    };

    private final String[] colors = {
            "Black", "White", "Blue", "Red",
            "Green", "Gray", "Beige", "Brown"
    };

    private final String[] sizes = {
            "S", "M", "L", "XL"
    };



    public void run(String... args) {

        long existingProducts = productRepository.count();

        if (existingProducts >= 500) {
            System.out.println("Product seed skipped. Already have 500+ products.");
            return;
        }

        int productsToCreate = (int) (500 - existingProducts);

        List<Product> products = new ArrayList<>();

        for (int i = 1; i <= productsToCreate; i++) {

            Product.Category category =
                    i % 2 == 0
                            ? Product.Category.MEN
                            : Product.Category.WOMEN;

            String subCategory;

            if (category == Product.Category.MEN) {
                subCategory = menSubCategories[
                        random.nextInt(menSubCategories.length)
                        ];
            } else {
                subCategory = womenSubCategories[
                        random.nextInt(womenSubCategories.length)
                        ];
            }

            String brand =
                    brands[random.nextInt(brands.length)];

            String color =
                    colors[random.nextInt(colors.length)];

            double price =
                    500 + random.nextInt(4501);

            int stock =
                    5 + random.nextInt(96);

            Product product = Product.builder()
                    .name(category + " " + subCategory + " " + i)
                    .category(category)
                    .subCategory(subCategory)
                    .brand(brand)
                    .sizes(List.of(
                            sizes[random.nextInt(sizes.length)],
                            sizes[random.nextInt(sizes.length)]
                    ))
                    .color(color)
                    .price(price)
                    .stock(stock)
                    .description(
                            "Premium " + subCategory +
                                    " from " + brand +
                                    " designed for everyday fashion."
                    )
                    .imageUrls(List.of(
                            "https://example.com/product-" + i + "-1.jpg",
                            "https://example.com/product-" + i + "-2.jpg"
                    ))
                    .active(true)
                    .build();

            products.add(product);
        }

        productRepository.saveAll(products);

        System.out.println(
                productsToCreate +
                        " development products generated."
        );
    }
}
