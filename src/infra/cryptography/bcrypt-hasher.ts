import { HasherComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HasherGenerator } from "@/domain/forum/application/cryptography/hasher-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HasherGenerator, HasherComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
