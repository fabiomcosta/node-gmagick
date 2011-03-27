#include <v8.h>
#include <node.h>
#include <Magick++.h>

using namespace node;
using namespace v8;

class Image: ObjectWrap{

private:
    
    Magick::Image magick_image;
    
public:
    
    Image(){
    }
    ~Image(){
    }
    
    static Persistent<FunctionTemplate> s_ct;
    
    static void Init(Handle<Object> target){
        HandleScope scope;

        Local<FunctionTemplate> t = FunctionTemplate::New(New);

        s_ct = Persistent<FunctionTemplate>::New(t);
        s_ct->InstanceTemplate()->SetInternalFieldCount(1);
        s_ct->SetClassName(String::NewSymbol("Image"));

        NODE_SET_PROTOTYPE_METHOD(s_ct, "save", Save);
        NODE_SET_PROTOTYPE_METHOD(s_ct, "crop", Crop);
        
        t->PrototypeTemplate()->SetAccessor(String::NewSymbol("size"), Size);

        target->Set(String::NewSymbol("Image"), s_ct->GetFunction());
    }

    static Handle<Value> New(const Arguments& args){
        HandleScope scope;
        
        Image* image = new Image();
        
        String::Utf8Value image_path(args[0]->ToString());
        image->magick_image.read(*image_path);
        
        image->Wrap(args.This());
        return args.This();
    }
    
    static Handle<Value> Crop(const Arguments& args){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(args.This());
        
        int width(args[0]->NumberValue());
        int height(args[1]->NumberValue());
        int offsetX(args[2]->NumberValue());
        int offsetY(args[3]->NumberValue());
        
        image->magick_image.crop(Magick::Geometry(width, height, offsetX, offsetY));
        
        return args.This();
    }
    
    static Handle<Value> Save(const Arguments& args){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(args.This());
        
        String::Utf8Value image_path(args[0]->ToString());
        image->magick_image.write(*image_path);
        
        return args.This();
    }
    
    static Handle<Value> Size(Local<String> property, const AccessorInfo& info){
        HandleScope scope;
        Image* image = ObjectWrap::Unwrap<Image>(info.This());
        
        Magick::Geometry geometry(image->magick_image.size());
        
        Local<Array> size = Array::New(2);
        
        size->Set(0, Integer::New(geometry.width()));
        size->Set(1, Integer::New(geometry.height()));
        
        return scope.Close(size);
    }

};

Persistent<FunctionTemplate> Image::s_ct;

extern "C" {
    void init (Handle<Object> target){
        Image::Init(target);
    }
    NODE_MODULE(imagick, init);
}  