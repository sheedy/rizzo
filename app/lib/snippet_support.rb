module SnippetSupport

  def template_for(snippet, secure=false, scope='core')
    if secure
      "layouts/#{scope}/snippets/_secure_#{snippet}"
    else
      "layouts/#{scope}/snippets/_#{snippet}"
    end  
  end

  def user_nav?(args)
    if args[:displaySignonWidget] == 'false' || args[:user_nav] == 'false'
      false
    else 
      true
    end  
  end

end