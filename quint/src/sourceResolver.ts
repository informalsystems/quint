/* ----------------------------------------------------------------------------------
 * Copyright (c) Informal Systems 2023. All rights reserved.
 * Licensed under the Apache 2.0.
 * See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------- */

/**
 * Source resolution for Quint. This module deals with loading sources from strings
 * and files.
 *
 * @author Igor Konnov
 *
 * @module
 */
import { Either, left, right } from '@sweet-monads/either'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

/**
 * A general interface for resolving sources.
 */
export interface SourceResolver {
  /**
   * Load text from the source pointed by the path. The path must be relative to the
   * basepath.
   * 
   * @param basepath a name that used as a stem, when the path is relative, e.g., `./`.
   * @param path a name that is resolvable by a source resolver, e.g., "./foo/bar.qnt"
   * @returns either `left(errorMessage)` if the source cannot be loaded, or `right(text)`.
   */
  load: (basepath: string, path: string) => Either<string, string>

  /**
   * Extract the resolver-specific stem from a path, e.g., the directory name
   * if path is a path in a filesystem.
   * @param path a path
   * @returns the stem of a path, e.g., the parent directory
   */
  stempath: (path: string) => string
}

/**
 * Read the source code in UTF-8 from the filesystem via NodeJS API.
 * @param basePath the base path to use as the relative path lookup.
 * @returns A filesystem resolver. For each path, it returns
 *          either `left(errorMessage)`, or `right(fileContents)`.
 */
export const fileSourceResolver = (): SourceResolver => {
  return {
    load: (basepath: string, path: string): Either<string, string> => {
      const fullPath = join(basepath, path)
      try {
        return right(readFileSync(fullPath, 'utf8'))
      } catch (err: any) {
        return left(err.message)
      }
    },

    stempath: (path: string): string => {
      return dirname(path)
    }
  }
}

/**
 * Read the source code from a map of strings. This resolver is especially
 * useful for tests.
 * @param sources a map of paths mapped to text
 * @returns a static resolver that uses the map to read the contents.
*/
export const stringSourceResolver = (sources: Map<string, string>): SourceResolver => {
  return {
    load: (basepath: string, path: string): Either<string, string> => {
      // We are using nodejs path.join here.
      // If we have to decouple this resolver from nodejs in the future,
      // we would have to write our own version of join.
      const fullpath = join(basepath, path)
      const contents = sources.get(fullpath)
      return contents ? right(contents) : left(`Source not found: '${fullpath}'`)
    },

    stempath: (path: string): string => {
      return dirname(path)
    }
  }
}