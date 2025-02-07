'use client';

import useSWR from 'swr';

import { FeaturedProductsCarousel } from '@/vibes/soul/sections/featured-products-carousel';
import { GetFeaturedProductResponse } from '~/app/api/products/featured/route';
import { runtime } from '~/lib/makeswift/runtime';
import { featuredProductsControls } from '~/makeswift/composed-controls/featured-products-controls';
import { useBcProductToVibesProduct } from '~/makeswift/utils/use-bc-product-to-vibes-product/use-bc-product-to-vibes-product';

interface Props {
  className?: string;
  limit: number;
  title: string;
  description?: string;
  showButton: boolean;
  buttonText: string;
  buttonHref: { href: string };
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function MakeswiftFeaturedProductsCarousel({
  className,
  limit,
  title,
  description,
  showButton,
  buttonText,
  buttonHref,
}: Props) {
  const bcProductToVibesProduct = useBcProductToVibesProduct();

  const { data } = useSWR<GetFeaturedProductResponse>('/api/products/featured', fetcher);

  const cta = showButton ? { label: buttonText, href: buttonHref.href } : undefined;
  const products = data?.slice(0, limit).map(bcProductToVibesProduct) ?? [];

  return (
    <div className={className}>
      {/* TODO: Fix skeleton */}
      <FeaturedProductsCarousel
        cta={cta}
        description={description}
        products={products}
        title={title}
      />
    </div>
  );
}

runtime.registerComponent(MakeswiftFeaturedProductsCarousel, {
  type: 'catalog-featured-products-carousel',
  label: 'Catalog / Featured Products Carousel',
  props: featuredProductsControls(),
});
