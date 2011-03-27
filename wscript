from os import popen

srcdir = '.'
blddir = '_build'
VERSION = '0.0.1'

def set_options(opt):
    opt.tool_options('compiler_cxx')

def configure(conf):
    conf.check_tool('compiler_cxx')
    conf.check_tool('node_addon')
    magick_config = conf.find_program('Magick++-config', mandatory=True)
    conf.env.append_value("CPPFLAGS", ''.join(popen("%s --cxxflags --cppflags" % magick_config).readlines()).strip().split())
    conf.env.append_value("LINKFLAGS", ''.join(popen("%s --ldflags --libs" % magick_config).readlines()).strip().split())

def build(bld):
    obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
    obj.target = 'binding'
    obj.source = 'binding.cc'
