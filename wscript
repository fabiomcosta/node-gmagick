from os import popen

srcdir = '.'
blddir = 'build'
VERSION = '0.0.1'

def set_options(opt):
    opt.tool_options('compiler_cxx')

def configure(conf):
    conf.check_tool('compiler_cxx')
    conf.check_tool('node_addon')

def build(bld):
    obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
    obj.cxxflags = obj.to_list(popen("echo `Magick++-config --cxxflags --cppflags`").readline().strip())
    obj.linkflags = obj.to_list(popen("echo `Magick++-config --ldflags --libs`").readline().strip())
    obj.target = 'imagick'
    obj.source = 'imagick.cc'
