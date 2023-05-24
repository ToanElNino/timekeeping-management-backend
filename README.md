## Description

Marketplace server repository.

## Installation

```bash
$ yarn install
```

## Setup
0. Setup infrastructure
- Install docker: https://docs.docker.com/engine/install/
- Install docker-compose: https://docs.docker.com/compose/install/
- Up containers:

```bash
docker-compose up -d
```

1. Create .env file using env.example

Note: Please set prod-api, prod-worker to NODE_ENV, it'll require KMS service to encrypt and decrypt the private key.

2. Create database structure.

Run the **Migration** for the first time to create the database structure.

3. Setup currency config
```bash
INSERT INTO currency_config (swap_id,network,chain_name,chain_id,average_block_time,required_confirmations,temp_required_confirmations,rpc_endpoint,explorer_endpoint,scan_api)
	VALUES (1,'polygon','mumbai','80001',2000,128,0,'https://matic-mumbai.chainstacklabs.com/','https://polygonscan.com/','https://api-testnet.polygonscan.com');
```

4. Setup Key Management Service (KMS)

a. Create a Customer managed keys on  AWS KMS

b. Add current EC2 instance role to Key users on Customer managed keys

c. Insert KMS information record. Example:

```bash
INSERT INTO kms_cmk (id,region,alias,arn,is_enabled)
	VALUES ('fd131b3a-3460-4dfb-aa11-880edae38cfb','us-east-1','test-kms','arn:aws:kms:us-east-1:941141242545:key/fd131b3a-3460-4dfb-aa11-880edae38cfb',1);
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Migration
1. Run migration: npm run migration:run

## Seed
1. yarn seed:_tags_ (tags: all, admin, currency-token, currency-config, kms-cmk)

For example: # create super admin user
```bash
yarn seed:admin
```
_**superAdmin account will be printed on console.**_

## License

This project is under [MIT licensed](LICENSE).

## Gen SSL
You need to generate sslcert with your domain and replace sslcert folder.



