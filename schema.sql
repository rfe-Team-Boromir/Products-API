DROP DATABASE IF EXISTS overview;

-- create the database
CREATE DATABASE overview;

-- Go into database
\c overview;


-- Create our tables
-- id,name,slogan,description,category,default_price
CREATE TABLE products(
  product_id int,
  product_name varchar(1000),
  slogan varchar(10000),
  descript varchar(10000),
  category varchar(255),
  default_price varchar(255),
  PRIMARY KEY(product_id)
);

-- id,productId,name,sale_price,original_price,default_style
CREATE TABLE styles(
  style_id int,
  product_id int,
  style_name varchar(1000),
  sale_price varchar(100),
  original_price varchar(100),
  default_style int,
  PRIMARY KEY(style_id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES products(product_id)
);

-- id,product_id,feature,value
CREATE TABLE features(
  feature_id int,
  product_id int,
  feature_name varchar(255),
  feature_value varchar(255),
  PRIMARY KEY(feature_id),
  CONSTRAINT fk_product
    FOREIGN KEY(product_id)
      REFERENCES products(product_id)
);

-- id,styleId,url,thumbnail_url
CREATE TABLE photos(
  photo_id int,
  style_id int,
  photo_url text,
  thumbnail_url text,
  PRIMARY KEY(photo_id),
  CONSTRAINT fk_style
    FOREIGN KEY(style_id)
      REFERENCES styles(style_id)
);

-- id,styleId,size,quantity
CREATE TABLE sizes(
  size_id int,
  style_id int,
  size varchar(100),
  quantity int,
  PRIMARY KEY(size_id),
  CONSTRAINT fk_style
    FOREIGN KEY(style_id)
      REFERENCES styles(style_id)
);

-- id,current_product_id,related_product_id
CREATE TABLE related(
  id int,
  current_product_id int,
  related_product_id int,
  CONSTRAINT fk_product
  FOREIGN KEY(current_product_id )
    REFERENCES products(product_id)
);


copy products(product_id, product_name, slogan, descript, category, default_price) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/product.csv' delimiter ',' csv header;

copy styles(style_id, product_id, style_name, sale_price, original_price, default_style) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/styles.csv' delimiter ',' csv header;

copy features(feature_id, product_id, feature_name, feature_value) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/features.csv' delimiter ',' csv header;

copy photos(photo_id, style_id, photo_url, thumbnail_url) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/photos.csv' delimiter ',' csv header;

copy sizes(size_id, style_id, size, quantity) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/skus.csv' delimiter ',' csv header;

copy related(id, current_product_id, related_product_id) from '/Users/xiaowu/Hack Reactor Course/RFE-SDC-Team-Boromir/API/files/related.csv' delimiter ',' csv header;

CREATE INDEX idx_product_id on product(product_id);

CREATE INDEX idx_feature_product_id on features(product_id);

CREATE INDEX idx_style_id on styles(style_id);

CREATE INDEX idx_style_photos_id on photos(style_id);

CREATE INDEX idx_style_sizes_id on sizes(style_id);

CREATE INDEX idx_related_id on related(current_product_id);