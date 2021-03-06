import { makeExecutableSchema } from '@graphql-tools/schema';

import { stitchingDirectives } from '../src';

describe('type merging directives', () => {
  const { stitchingDirectivesTypeDefs, stitchingDirectivesValidator } = stitchingDirectives();

  test('does not throws an error if no other typeDefs used', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).not.toThrow();
  });

  test('throws an error if type selectionSet invalid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      type Query {
        _user: User
      }

      type User @key(selectionSet: "** invalid **") {
        id: ID
        name: String
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).toThrow();
  });

  test('does not throws an error if type selectionSet valid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      type Query {
        _user: User
      }

      type User @key(selectionSet: "{ id }") {
        id: ID
        name: String
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).not.toThrow();
  });

  test('throws an error if computed selectionSet invalid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      type Query {
        _user: User
      }

      type User {
        id: ID
        name: String @computed(selectionSet: "*** invalid ***")
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).toThrow();
  });

  test('does not throws an error if computed selectionSet valid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      type Query {
        _user: User
      }

      type User {
        id: ID
        name: String @computed(selectionSet: "{ id }")
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).not.toThrow();
  });

  test('throws an error if merge argsExpr invalid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      scalar _Key

      type Query {
        _user(key: _Key): User @merge(argsExpr: "key: $$key")
      }

      type User @key(selectionSet: "{ id }") {
        id: ID
        name: String
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).toThrow();
  });

  test('does not throws an error if merge argsExpr valid', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      scalar _Key

      type Query {
        _user(key: _Key): User @merge(argsExpr: "key: $key")
      }

      type User @key(selectionSet: "{ id }") {
        id: ID
        name: String
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).not.toThrow();
  });

  test('does not throws an error if merge used without arguments', () => {
    const typeDefs = `
      ${stitchingDirectivesTypeDefs}
      scalar _Key

      type Query {
        _user(key: _Key): User @merge
      }

      type User @key(selectionSet: "{ id }") {
        id: ID
        name: String
      }
    `;

    expect(() => makeExecutableSchema({ typeDefs })).not.toThrow();
    expect(() => makeExecutableSchema({ typeDefs, schemaTransforms: [stitchingDirectivesValidator] })).not.toThrow();
  });
});
