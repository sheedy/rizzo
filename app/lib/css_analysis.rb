module CSSAnalysis

  require 'open-uri'

  extend self

  def fetch(stylesheet)
    @stats ||= fetchStats(stylesheet)
    if stylesheet == "all"
      addComparisonStats
      orderedStats
    else
      @stats['today'].find {|stat| stat[:id] == stylesheet}
    end
  end


  private

  def dates
    {
      today: 61.minutes.ago.strftime("%Y-%m-%d"),
      yesterday: Time.now.yesterday.strftime("%Y-%m-%d"),
      last_week: Time.now.weeks_ago(1).strftime("%Y-%m-%d")
    }
  end

  def fetchStats(stylesheet)
    @stats = {}

    ["today", "yesterday", "last_week"].each do |file|
      suffix = dates[:"#{file}"]
      begin
        @stats[file] = JSON.parse(open("http://assets.staticlp.com/perf/css-analysis/result-#{suffix}.json").read).map do |stat|
          removeCruft(stat)
          processStats(stat)
        end
      rescue
        @stats[file] = []
      end
    end
    @stats
  end

  def removeCruft(stat)
    stat['result'].delete('paths')
    stat['result'].delete('stylesheets')
    stat['result'].delete('lowestCohesion')
    stat['result'].delete('lowestCohesionSelector')
    stat['result'].delete('mostIdentifier')
    stat['result'].delete('simplicity')
    stat['result'].delete('dataUriSize')
  end

  def processStats(stat)
    {
      core: {
        size: "#{stat['result'].delete("size")/1000}",
        gzippedSize: "#{stat['result'].delete("gzippedSize")/1000}"
      },
      groups: {
        uniqueFontSize: stat['result'].delete("uniqueFontSize"),
        uniqueColor: stat['result'].delete("uniqueColor"),
        propertiesCount: stat['result'].delete("propertiesCount")
      },
      timestamp: stat['result'].delete('published'),
      name: stat.delete('name'),
      id: stat.delete('id'),
      other: stat['result']
    }
  end

  def compareStats(current, previous)
    result = ((current.to_f/previous.to_f)*100 - 100).round(1)
    result == 0.0 ? result.round : result
  end

  def addComparisonStats
    @stats['today'].each do |stat|
      stat[:compare] = {
        yesterday: compareStats(stat[:core][:gzippedSize], (@stats['yesterday'].find {|y| y[:id] == stat[:id]})[:core][:gzippedSize]),
        last_week: compareStats(stat[:core][:gzippedSize], (@stats['last_week'].find {|y| y[:id] == stat[:id]})[:core][:gzippedSize])
      }
    end
  end

  def orderedStats
    @stats['today'].sort { |x,y| y[:core][:gzippedSize].to_i <=> x[:core][:gzippedSize].to_i}
  end

end
