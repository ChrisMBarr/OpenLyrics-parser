import { OpenLyrics } from '.';

describe('OpenLyrics', (): void => {
  let olParser: OpenLyrics;

  beforeEach(() => {
    olParser = new OpenLyrics();
  });

  it('should exist', () => {
    expect(olParser).toBeDefined();
  });

});
