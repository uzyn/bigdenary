export class BigDenary {
  base: BigInt;
  decimals: number;

  constructor(n: number | string | BigDenary, decimals?: number) {
    this.decimals = decimals ? decimals : 18;
    this.base = BigInt(n);
  }

  // toString(): string {
  //   console.info('RUN THIS');
  //   return 'adsfasdf';
  // }
}
