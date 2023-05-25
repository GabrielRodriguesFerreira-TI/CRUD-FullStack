import { S3 } from "@aws-sdk/client-s3";
import "dotenv/config";
// Note that the AWS config is not being done directly in the code,
// this is because the S3 system itself captures the values inside the .env file

class S3Storage {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: String(process.env.AWS_REGION),
    });
  }

  async saveFile(
    filename: string,
    buffer: Buffer,
    mimetype: string
  ): Promise<void> {
    this.client.putObject({
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    });
  }

  async deleteFile(filename: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: filename,
    });
  }
}

export default S3Storage;
