// Interface for input to comparePassword function
export interface IComparePasswordInput {
  normalPassword: string;
  hashedPassword: string;
}

// Interface for output from comparePassword function
export interface IComparePasswordOutput {
  isMatched: boolean;
}

// Interface for input to hashPassword function
export interface IHashPasswordInput {
  string: string;
}

// Interface for output from hashPassword function
export interface IHashPasswordOutput {
  hashedString: string;
}
