import urllib.request
from abc import ABCMeta, abstractmethod


class Parser(object):
    __metaclass__ = ABCMeta

    def __init__(self, url):
        self._url = url

    @abstractmethod
    def parse(self):
        raise NotImplementedError()

    def _retrieve_page(self, file_name_with_ext):
        return urllib.request.urlretrieve(self._url, file_name_with_ext)

