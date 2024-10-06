import { Container, Filters, Stories, Title, TopBar } from "@/shared/components/shared";
import { ProductsGroupList } from "@/shared/components/shared/products-group-list";
import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/shared/lib/find-pizza";

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {

  const categories = await findPizzas(searchParams)

  return <>

    <Container className="mt-10">
      <Title text="Все пиццы" size="lg" className="font-extrabold" />
    </Container>

    <TopBar categories={categories.filter(category => category.products.length > 0)} />

    <Stories />

    <Container className="pb-14 mt-10">
      <div className="flex gap-[80px]">
        {/* Фильтрация */}
        <div className="w-[250px]">
          <Suspense>
            <Filters />
          </Suspense>
        </div>
        {/* Список товаров */}
        <div className="flex-1">
          <div className="flex flex-col gap-16">

            {categories.map(
              (category) => (
                category.products.length > 0 && (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    items={category.products}
                    categoryId={category.id}
                  />
                )
              ))}

          </div>
        </div>

      </div>
    </Container>

  </>
}
