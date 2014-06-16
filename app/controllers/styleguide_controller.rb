class StyleguideController < GlobalController

  layout proc{|c| c.request.xhr? ? false : "styleguide" }
  before_filter :setup

  def setup
    @app = StyleGuide.new(request.fullpath)
  end

  def designElements
    render "/styleguide/design-elements/#{params[:section]}"
  end

  def pageLayout
    render "/styleguide/page-layout/#{params[:section]}"
  end

  def uiComponent
    render "/styleguide/ui-components/#{params[:section]}"
  end

  def jsComponent
    render "/styleguide/js-components/#{params[:section]}"
  end

  def cssUtility
    render "/styleguide/css-utilities/#{params[:section]}"
  end

end
