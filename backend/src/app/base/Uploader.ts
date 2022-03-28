import pump, { Stream } from 'pump';
import { v4 as uuid } from 'uuid';
import fs, { PathLike } from 'fs';
import path from 'path';
import { FastifyRequest } from 'fastify';

// FIXME: Older files are not getting deleted when the container restarts

export interface AppFileUpload {
  uuid: string;
  path: string;
  name: string;
  mimetype: string;
}

export interface AppUploaderForm {
  files: AppFileUpload[];
  fields: any;
}

export default class Uploader {
  filepath: string;
  fields: any;
  files: any[];
  fileLifespan: number;
  constructor(filepath?: string) {
    this.filepath =
      filepath || path.join(process.env.APP_WORKDIR ? process.env.APP_WORKDIR : './', '/tmp');
    this.fields = {};
    this.files = [];
    this.fileLifespan = process.env.BACKEND_FILE_LIFESPAN
      ? +process.env.BACKEND_FILE_LIFESPAN
      : 60000;
    this.createTempDir();
  }

  public extractForm = (req: FastifyRequest): Promise<AppUploaderForm> => {
    return new Promise((resolve, reject) => {
      let files: AppFileUpload[] = [];
      let fields: any[] = [];
      // TODO: Abstract this function into another one
      const busboy = req.multipart(
        (
          field: unknown,
          file: Stream,
          filename: string,
          encoding: string,
          mimetype: string
        ): void => {
          const fileId = uuid();
          const localFilepath = path.join(this.filepath, fileId);
          pump(file, fs.createWriteStream(localFilepath));
          files.push({
            uuid: fileId,
            path: localFilepath,
            name: filename,
            mimetype: mimetype,
          });
          this.deleteFileAfterTimeout(localFilepath, this.fileLifespan);
        },
        (error: unknown) => {
          if (error) reject(error);
        }
      );

      busboy.on('field', (fieldname: string, fieldvalue: string): void => {
        this.fields[fieldname] = fieldvalue;
      });

      busboy.on('finish', () =>
        resolve({
          files: files,
          fields: fields,
        })
      );
    });
  };

  public getFilePathByUuid(uuid: string | undefined): PathLike | '' {
    const filePath = path.join(this.filepath, uuid || '');
    const fileExists = !!uuid && fs.existsSync(filePath);
    if (fileExists) {
      return filePath;
    }
    return '';
  }

  public getFileStringByUuid = async (uuid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const filePath = this.getFilePathByUuid(uuid);
      if (filePath && typeof filePath !== 'boolean') {
        fs.readFile(filePath, {}, (error: unknown, buffer: Buffer) => {
          if (error) reject(error);
          const fileString = buffer.toString('base64');
          return resolve(fileString);
        });
      }
    });
  };

  /**
    private getFilePathByUuid(uuid: string): Promise<PathLike | boolean> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.filepath, uuid);
      fs.readFile(filePath, {}, (err, file) => {
        if(err) reject(err);
      })
    })
  }
   */

  private deleteFileAfterTimeout(path: PathLike, timeout: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fs.unlink(path, (err) => {
          if (err) reject(false);
          resolve(true);
        });
      }, timeout);
    });
  }

  private createTempDir = () => {
    if (!fs.existsSync(this.filepath)) {
      fs.mkdirSync(this.filepath);
    }
  };
}
