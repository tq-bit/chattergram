import { Deepgram } from '@deepgram/sdk';
import { PrerecordedTranscriptionResponse } from '@deepgram/sdk/dist/types';
import fs, { PathLike } from 'fs';

export default class Transcriber {
  filePath: PathLike;
  mimeType: string;
  apiKey: string;
  deepgram: Deepgram;
  constructor(filePath: PathLike, mimeType: string, apiKey?: string) {
    this.handleInitErrors(filePath, apiKey);
    this.apiKey = process.env.DEEPGRAM_KEY || apiKey || '';
    this.filePath = filePath;
    this.mimeType = mimeType;
    this.deepgram = new Deepgram(this.apiKey);
  }

  public translateFromLocalFile = async () => {
    const streamSource = {
      stream: fs.createReadStream(this.filePath),
      mimetype: this.mimeType,
    };

    const response = await this.deepgram.transcription.preRecorded(streamSource, {
      punctuate: true,
    });

    const transcript = this.getHighestRatedTranscript(response);

    return transcript;
  };

  private getHighestRatedTranscript = (response: PrerecordedTranscriptionResponse) => {
    const highestConfidenceResponse = response.results?.channels[0].alternatives.sort(
      (a, b) => a.confidence - b.confidence
    )[0];
    return highestConfidenceResponse;
  };

  private handleInitErrors = (filePath: PathLike, apiKey: string | undefined): void => {
    if (!apiKey && !process.env.DEEPGRAM_KEY) {
      throw new Error('No api key found. Add in .env file or initialize this class with one');
    }

    if (!filePath) {
      throw new Error('Must provide the path to a file to read');
    }
  };
}
