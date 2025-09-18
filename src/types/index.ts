//######## Common Data TYpes ########
// --- Media Interfaces ---
// These are for image and file data
export interface Media {
  id: number;
  mime: string;
  extension: string;
  alt_text?: string | null | undefined;
  caption: string | null;
  full_name: string;
  full_path: string;
  thumb_name: string;
  thumb_path: string;
}


export interface Banner {
  attachment_type: string;
  media_id: number;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  media: Media;
}

// --- URL Info Interface ---
export interface UrlInfo {
  url_title: string;
  url_slug: string;
  canonical: string | null;
}

// --- Page Content Interfaces ---
export interface Meta {
  meta_title: string;
  meta_keywords: string | null;
  meta_description: string;
}

export interface MenuItem {
  id: number;
  type_id: number;
  parent_id: number;
  item_title: string;
  url_segment: string;
  external_link: string | null;
  is_external: number;
  item_order: number;
  deleted_at: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  item_slug: string;
  children?: MenuItem[]; // Optional and recursive for nested menus
}

export interface MenuContainer {
  menu: MenuItem[];
}

export interface GlobalData {
  company_name?: string;
  address?: string;
  pobox?: string;
  email?: string;
  secondary_email?: string;
  phone?: string;
  mobile?: string;
  short_description?: string;
  established_year?: string;
  base_url?: string;
  contact_persion?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  pinterest?: string;
  youtube?: string;
  default_meta_title?: string;
  default_meta_keywords?: string;
  default_meta_description?: string;
  trip_advisor?: string;
  bookmundi?: string;
  tourradar?: string;
  logo_light?: string;
  logo_dark?: string;
  avatar?: string;
  google_verification_code?: string | null;
  sidebar_skin?: string;
  defaultogimage?: string;
  viator?: string;
  trip_of_the_month?: number;
  category_section_a?: number;
  category_section_b?: number;
  category_section_c?: number;
  tripadvisor_review_count?: number;
  google_review_count?: number;
  trustpilot_review_count?: number;
  notification?: string;
  avatar_1?: string;
  avatar_2?: string;
  avatar_3?: string;
  main_menu?: MenuContainer;
  footer_menu?: MenuContainer; // Assuming it also has a 'menu' property even if empty
  canvas_menu?: string | null; // Assuming null based on example
  extra_menu?: string | null; // Assuming null based on example
}


// ---- ##### card Item #########

export interface Breadcrumb {
  title: string,
  slug: string;
}

export interface PageContent {
  id: number;
  parent_id: number;
  page_title: string;
  page_key: string;
  page_order: number;
  page_description: string | null;
  publish_status: number;
  status: number;
  created_at: string;
  updated_at: string | null;
  urlinfo: UrlInfo;
  meta: Meta;
  featured: Media | null;
  banner: Media | null;
  banners: Banner | [];
  carousel: null;
  children: any[];
  breadcrumbs: Breadcrumb[][];
  related: string | null;
}

export interface CategoryContent {
  id: number;
  type_id: number;
  parent_id: number;
  title: string;
  description: string;
  extra_field_1: string | null;
  extra_field_2: string | null;
  status: number;
  category_order: number;
  is_featured: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  total_packages: number;
  total_blogs: number;
  urlinfo: UrlInfo;
  type: CategoryType;
  banner: Media | null;
  banners: Banner;
  meta: Meta;
  featured: Media | null;
  carousel: null;
  parent: null;
  children: ChildCategory[];
  packages: PackageItem[];
  blogs: BlogItem[];
}

export interface BlogContent {
  id: number;
  title: string;
  abstract: string | null;
  content: string;
  blog_date: string;
  publish_status: number;
  published_at: string;
  featured_status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  btag: any[];
  urlinfo: UrlInfo;
  meta: Meta;
  featured: Media;
  banners: Banner;
  banner: Media;
  carousel: null;
  valid_comments: any[];
  authors: AuthorItem[];
  categories: CategoryItem[];
  places: PlaceItem[];
}

// --- Category Interfaces ---
export interface CategoryType {
  id: number;
  category_type: string;
  category_key: string;
  description: string | null;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface CategoryItem {
  id: number;
  icon?: string | null;
  type_id: number;
  parent_id: number;
  title: string;
  extra_field_1: null;
  extra_field_2: null;
  status: boolean;
  category_order: number;
  is_featured: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  all_packages: number;
  total_packages: number;
  total_blogs: number;
  urlinfo: UrlInfo;
  banner?: Media | null;
  banners?: Banner;
  featured: Media | null;
  type?: CategoryType;
  carousel?: null;
  packages?: PackageItem[];
}

export interface AuthorItem {
  name: string;
  avatar?: Media | null;
  urlinfo: UrlInfo;
}

export interface TeamItem {
  id: number,
  name: string;
  avatar: Media | null;
  urlinfo: UrlInfo;
  position_order: number, 
  full_name: string;
  position: string;
}

interface BlogCategory {
  id: number;
  title: string;
  urlinfo: UrlInfo;
}
export interface BlogItem {
  title: string;
  featured?: Media;
  blog_date: string;
  urlinfo: UrlInfo;
  categories?: BlogCategory[];
  authors?: AuthorItem[];
}


// --- Testimonial Interfaces ---
export interface Testimonial {
  id: number;
  salutation: string;
  full_name: string;
  review_abstract: string | null;
  review_title: string;
  review: string;
  review_rating: number;
  review_date: string;
  country_code: string;
  country_name: string;
  address: string;
  affiliate_organization: string;
  organization_address: string | null;
  organization_position: string | null;
  organization_description: string | null;
  organization_link: string | null;
  is_featured: number;
  status: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  avatar: Media | null;
}

export interface PackageItem {
  id: number;
  package_title: string;
  package_duration: number;
  package_duration_type: string;
  package_discount: number;
  additional_field_1: string | null;
  total_testimonials: number;
  package_cats: number[];
  places_cats: number[];
  related_packages: any[];
  group_default_price: number;
  has_itinerary: boolean;
  has_departure: boolean;
  urlinfo: UrlInfo;
  featured: Media;
  itinerary: Itinerary;
}


// ########## Package Data Type  ###########

export interface Groupprice {
  id: number;
  package_id: number;
  package_tier?: string;
  min_people: number;
  max_people: number;
  short_description: string | null;
  unit_price: number;
  offer_unit_price: number;
  offer_label: string | null;
  offer_information: string | null;
  is_default: number;
  updated_at: string | null;
  created_at: string
}

export interface Tierdata {
  id: number;
  package_id: number;
  package_tier: string;
  package_tier_alias: string | null;
  package_tier_description: string | null;
  package_cost_includes: string | null;
  package_cost_excludes: string | null;
  wetravel_uuid: string | null;
  updated_at: string | null;
  created_at: string
}

interface AdditionalFacts {
  id: number;
  fact_title: string;
  fact_value: string
}

export interface ItineraryItem {
  id: number;
  itinerary_id: number;
  itinerary_day: any;
  itinerary_title: string;
  itinerary_short_description: string;
  itinerary_description: string;
  itinerary_stop: number;
  origin: string | null;
  origin_coordinate: string | null;
  origin_elevation: string | null;
  destination: string | null;
  destination_coordinate: string | null;
  destination_elevation: string | null;
  travel_mode: string | null;
  distance: string | null;
  duration: string | null;
  meals: string | null;
  accommodation: string | null;
  itinerary_footnote: string | null;
  itinerary_status: number;
  updated_at: string | null;
  deleted_at: string | null;
  created_at: string;
  gallery: Banner[];
  facts: AdditionalFacts[] | []
}

interface Itinerary {
  id: number;
  package_id: number;
  itinerary_title: string;
  itinerary_details: string | null;
  itinerary_map: string | null;
  map_data: null;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  banners: Banner[];
  details: ItineraryItem[] | null
}

export interface PackageCategory {
  id: number;
  title: string;
  description?: string | null;
  total_packages: number;
  total_blogs: number
}

export interface DepartureItem {
  id: number;
  package_id: number;
  departure_date: string;
  departure_cost: number;
  departure_note: string | null;
  departure_status: string | null;
  created_at: string;
  updated_at: string | null
}

export interface PlaceItem {
  id: number;
  place_name: string;
  place_abstract: string | null;
  place_description: string | null;
  place_elevation: string | null;
  place_coordinates: string | null;
  place_map: string | null;
  place_extra: string | null;
  status: number;
  is_featured: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  total_packages: number;
  total_blogs: number;
  featured: Media | null;
  urlinfo: UrlInfo;
  banner?: Media | null;
  banners?: Banner | []
}

export interface PackageContent {
  id: number;
  package_title: string;
  package_abstract: string | null;
  package_details: string | null;
  package_highlights: string | null;
  package_cost_includes: string | null;
  package_cost_excludes: string | null;
  package_extra_faqs: string | null;
  package_price: number;
  package_duration: number;
  package_duration_type: string;
  package_destination: number[];
  package_grade: number[];
  package_style: number[];
  package_meals: number[];
  package_accommodation: number[];
  package_discount: number | null;
  package_group_size: number | null;
  package_max_altitude: string | null;
  package_departure_note: string | null;
  package_useful_info: string | null;
  package_trip_info: string | null;
  package_map_path: string | null;
  package_geo_longitude: string | null;
  package_geo_latitude: string | null;
  additional_field_1: string | null;
  additional_field_2: string | null;
  package_order: number;
  status: number;
  is_featured: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  group_faqs: any[];
  all_testimonials?: number;
  total_testimonials?: number;
  package_cats: any[];
  places_cats: any[];
  related_packages: any[];
  group_default_price: number | null;
  has_itinerary: boolean;
  has_departure: boolean;
  urlinfo: UrlInfo;
  Meta: Meta;
  featured: Media | null;
  banner: Media | null;
  banners: Banner[] | [];
  media_reels: any[];
  reels: any[];
  carousel: null;
  pricegroup: Groupprice[] | [];
  tierdata: Tierdata[] | [];
  additional_facts: AdditionalFacts[] | [];
  faqs: any[];
  cost_includes: any[];
  cost_excludes: any[];
  tripinfo: any[];
  itinerary: Itinerary | null;
  destination: PackageCategory;
  grade?: PackageCategory;
  style?: PackageCategory;
  transportation?: PackageCategory;
  meals?: PackageCategory;
  accommodation?: PackageCategory;
  testimonials: Testimonial[];
  faqcategories: any[];
  departures: DepartureItem[];
  active_departures:DepartureItem[];
  places: PlaceItem | [];
  groupFaqs?: any[];
  good_to_know?: any[]
}

export interface HomePageData {
  pagecontent: PageContent;
  featured_packages: PackageItem[];
  featured_categories: CategoryItem[];
  featured_places: PlaceItem[];
  featured_testimonials: Testimonial[];
  trip_of_the_month: PackageContent;
  category_section_a: CategoryItem;
}

export interface HomeResponse {
  status: 'success' | 'error';
  data: HomePageData
}

export interface PageResponse {
  status: 'success' | 'error';
  data: {
    page_type: string;
    content: PageContent;
    breadcrumbs: Breadcrumb[][];
    related: string;
  }
}

export interface BlogResponse {
  status: 'success' | 'error';
  data: {
    page_type: string;
    content: BlogContent;
    block1?: PackageItem[];
    block2?: PackageItem[];
    block3?: PackageItem[];
    block4?: PackageItem[];
    block5?: PackageItem[];
    block6?: PackageItem[];
    block7?: PackageItem[];
    block8?: PackageItem[];
    block_count: number;
    breadcrumbs: Breadcrumb[][]
    featured_categories: CategoryItem[];
    featured_packages: PackageItem[];

  };
}

export interface PackageResponse {
  status: 'success' | 'error';
  data: {
    page_type: string;
    content: PackageContent;
    featured_testimonials: Testimonial[];
    breadcrumbs: Breadcrumb[][];
    related: PackageItem[]
  }
}

export interface CategoryResponse {
    page_type: string;
    content: CategoryContent;
    breadcrumbs: Breadcrumb[][];
    related: any[];
}

export interface CategoryApiResponse {
  status: 'success' | 'error';
  data: CategoryResponse
}