import { shallowCompare } from '../utils';

describe('utils', () => {
  it('shallowCompare', () => {
    const tests = [
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: 'fff',
        },
        true,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
          baz: undefined,
        },
        {
          foo: 123,
          bar: 'fff',
          baz: undefined,
        },
        true,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: 'fff',
          baz: 'ggg',
        },
        false,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          baz: 'fff',
        },
        false,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: undefined,
        },
        false,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: undefined,
        },
        false,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: undefined,
        },
        false,
      ],
      [
        {
          foo: 123,
          bar: 'fff',
        },
        {
          foo: 123,
          bar: 'fff',
          baz: undefined,
        },
        false,
      ],
    ] as const;

    tests.forEach(([prevProps, nextProps, result]) =>
      expect(shallowCompare(prevProps, nextProps)).toBe(result),
    );
  });
});
