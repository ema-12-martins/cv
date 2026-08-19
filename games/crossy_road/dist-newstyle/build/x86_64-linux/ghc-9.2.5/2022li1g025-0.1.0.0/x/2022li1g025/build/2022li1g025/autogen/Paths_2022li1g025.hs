{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module Paths_2022li1g025 (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where


import qualified Control.Exception as Exception
import qualified Data.List as List
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude


#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1,0,0] []

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir `joinFileName` name)

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath



bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath
bindir     = "/home/emamartins12/.cabal/bin"
libdir     = "/home/emamartins12/.cabal/lib/x86_64-linux-ghc-9.2.5/2022li1g025-0.1.0.0-inplace-2022li1g025"
dynlibdir  = "/home/emamartins12/.cabal/lib/x86_64-linux-ghc-9.2.5"
datadir    = "/home/emamartins12/.cabal/share/x86_64-linux-ghc-9.2.5/2022li1g025-0.1.0.0"
libexecdir = "/home/emamartins12/.cabal/libexec/x86_64-linux-ghc-9.2.5/2022li1g025-0.1.0.0"
sysconfdir = "/home/emamartins12/.cabal/etc"

getBinDir     = catchIO (getEnv "2022li1g025_bindir")     (\_ -> return bindir)
getLibDir     = catchIO (getEnv "2022li1g025_libdir")     (\_ -> return libdir)
getDynLibDir  = catchIO (getEnv "2022li1g025_dynlibdir")  (\_ -> return dynlibdir)
getDataDir    = catchIO (getEnv "2022li1g025_datadir")    (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "2022li1g025_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "2022li1g025_sysconfdir") (\_ -> return sysconfdir)




joinFileName :: String -> String -> FilePath
joinFileName ""  fname = fname
joinFileName "." fname = fname
joinFileName dir ""    = dir
joinFileName dir fname
  | isPathSeparator (List.last dir) = dir ++ fname
  | otherwise                       = dir ++ pathSeparator : fname

pathSeparator :: Char
pathSeparator = '/'

isPathSeparator :: Char -> Bool
isPathSeparator c = c == '/'
