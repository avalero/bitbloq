module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(tsx|jsx|js|ts)?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['config', 'node_modules'],
};
